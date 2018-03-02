using DataTables;
using DataTables.EditorUtil;
using DXInfo.Web.Models;
using Microsoft.AspNet.Identity;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json;
using NLog;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Web;
using System.Web.Http;
using System.Web.Http.Tracing;
using DXInfo.DataTables.Events;

namespace DXInfo.Web.Controllers
{
    public delegate void PreMixVouchCreate(object sender, PreCreateEventArgs e);

    [ClaimAuthorize(CustomClaims.Editor)]
    [RoutePrefix("api/Editor")]
    public class EditorController : ApiController
    {
        Func<Dictionary<string, object>, object> LabelToObj()
        {
            return delegate (Dictionary<string, object> a)
            {
                return JsonConvert.DeserializeObject(JsonConvert.SerializeObject(a));
            };
        }
        private List<Field> ConvertToField(List<EditorField> editorFields)
        {
            List<Field> fields = new List<Field>();
            foreach (EditorField editorField in editorFields)
            {
                Field field = new Field(editorField.DbField);
                switch (editorField.Type)
                {
                    case "bool":
                        field = field.Type(typeof(bool));
                        break;
                    case "guid":
                        field = field.Type(typeof(Guid));
                        break;
                    case "int":
                        field = field.Type(typeof(int));
                        break;
                    case "decimal":
                        field = field.Type(typeof(decimal));
                        break;
                    case "int64":
                        field = field.Type(typeof(Int64));
                        break;
                    default:
                        field = field.Type(typeof(string));
                        break;
                }

                if (null != editorField.Options &&
                    !string.IsNullOrEmpty(editorField.Options.Table))
                {
                    if (null != editorField.Options.Condition)
                    {
                        if (!string.IsNullOrEmpty(editorField.Options.Label))
                        {
                            if (!string.IsNullOrEmpty(editorField.Options.Condition.Key))
                            {
                                field = field.Options(editorField.Options.Table,
                                editorField.Options.Value,
                                editorField.Options.Label,
                                q => q.Where(editorField.Options.Condition.Key,
                                editorField.Options.Condition.Value));
                            }
                            else
                            {
                                field = field.Options(editorField.Options.Table,
                                editorField.Options.Value,
                                editorField.Options.Label);
                            }
                        }
                        else
                        {
                            if (!string.IsNullOrEmpty(editorField.Options.Condition.Key))
                            {
                                field = field.Options(editorField.Options.Table,
                                editorField.Options.Value,
                                editorField.Options.Labels,
                                q => q.Where(editorField.Options.Condition.Key,
                                editorField.Options.Condition.Value),
                                (row => JsonConvert.DeserializeObject(JsonConvert.SerializeObject(row))));
                            }
                            else
                            {
                                field = field.Options(editorField.Options.Table,
                                editorField.Options.Value,
                                editorField.Options.Labels,
                                null,
                                (row => JsonConvert.DeserializeObject(JsonConvert.SerializeObject(row))));
                            }
                        }
                        
                    }

                }
                if (null != editorField.Validators && editorField.Validators.Count > 0)
                {
                    foreach (EditorValidator editorValidator in editorField.Validators)
                    {
                        Func<object, Dictionary<string, object>, ValidationHost, string> func = null;
                        ValidationOpts opts = null;
                        if (!string.IsNullOrEmpty(editorValidator.Message))
                        {
                            opts = new ValidationOpts() { Message = editorValidator.Message };
                        }
                        switch (editorValidator.Name)
                        {
                            case "Required":
                                func = Validation.Required(opts);
                                break;
                            case "Unique":
                                func = Validation.Unique(opts);
                                break;
                            case "DateFormat":
                                func = Validation.DateFormat(editorValidator.Format,opts);
                                break;
                            case "Boolean":
                                func = Validation.Boolean(opts);
                                break;
                        }
                        field = field.Validator(func);
                    }
                }
                if(!string.IsNullOrEmpty(editorField.GetFormatter))
                {
                    field = field.GetFormatter(Format.DateSqlToFormat(editorField.GetFormatter));
                }
                if (!string.IsNullOrEmpty(editorField.SetFormatter))
                {
                    field = field.SetFormatter(Format.DateFormatToSql(editorField.SetFormatter));
                }
                fields.Add(field);
            }
            return fields;
        }
        [HostAuthentication(OAuthDefaults.AuthenticationType)]
        [Route("Data")]
        [HttpPost]
        public IHttpActionResult Data(string model)
        {
            string mappedPath = System.Web.Hosting.HostingEnvironment.MapPath("~/EditorJson/"+ model + ".json");
            string fileText = File.ReadAllText(mappedPath);
            EditorConfig config = JsonConvert.DeserializeObject<EditorConfig>(fileText);
            var request = HttpContext.Current.Request;
            using (var db = new SqlserverDatabase())
            {
                var editor = new Editor(db, config.Table, config.Pkey);
                editor = editor.UserId(User.Identity.GetUserId<int>());
                editor = editor.IsBatch(User.Identity.GetIsBatch());
                editor = editor.IsLocator(User.Identity.GetIsLocator());
                editor = editor.IsShelfLife(User.Identity.GetIsShelfLife());
                editor = editor.TryCatch(config.TryCatch);
                editor = editor.ScrapVouchVerify(User.Identity.GetScrapVouchVerify());
                
                if (null == config.Fields || config.Fields.Count == 0)
                {
                    throw new Exception("请设置Fields");
                }
                editor = editor.Field(ConvertToField(config.Fields));
                List<EditorField> groupEditorFields = config.Fields.Where(w => w.Group).ToList();
                if (groupEditorFields.Count > 0)
                {
                    editor = editor.GroupField(ConvertToField(groupEditorFields));
                }
                
                if (null != config.LeftJoins &&
                    config.LeftJoins.Count > 0)
                {
                    foreach (EditorLeftJoin editorLeftJoin in config.LeftJoins)
                    {
                        if (editorLeftJoin.IsCondition)
                        {
                            editor = editor.LeftJoin(editorLeftJoin.Table, editorLeftJoin.Condition);
                        }
                        else
                        {
                            editor = editor.LeftJoin(editorLeftJoin.Table,
                            editorLeftJoin.Field1,
                            editorLeftJoin.Op,
                            editorLeftJoin.Field2);
                        }
                        
                    }
                }
                if(null != config.MJoin)
                {
                    if (string.IsNullOrEmpty(config.MJoin.Table))
                        throw new Exception("请设置MJoin的Table");
                    MJoin mJoin = new MJoin(config.MJoin.Table);
                    if (null == config.MJoin.Link1 || null == config.MJoin.Link2)
                        throw new Exception("请设置MJoin的Link1、Link2");
                    mJoin = mJoin.Link(config.MJoin.Link1.Field1, config.MJoin.Link1.Field2);
                    mJoin = mJoin.Link(config.MJoin.Link2.Field1, config.MJoin.Link2.Field2);
                    if (null == config.MJoin.Fields || config.MJoin.Fields.Count == 0)
                        throw new Exception("请设置MJoin的Fields");
                    mJoin.Field(ConvertToField(config.MJoin.Fields));
                    editor = editor.MJoin(mJoin);
                }
                if(null != config.Wheres &&
                    config.Wheres.Count > 0)
                {
                    foreach(EditorWhere where in config.Wheres)
                    {
                        editor = editor.Where(where.Key, where.Value, where.Op);
                    }
                }
                if(null != config.Event && null != config.Event.Methods && config.Event.Methods.Count>0)
                {
                    if (string.IsNullOrEmpty(config.Event.Type))
                        throw new Exception("请指定EventType");
                    Type t = Type.GetType(config.Event.Type);
                    object instance = Activator.CreateInstance(t);
                    foreach (EditorMethod editorMethod in config.Event.Methods)
                    {
                        EventInfo evtInfo = editor.GetType().GetEvent(editorMethod.EventName, BindingFlags.Instance | BindingFlags.Public);
                        Type eventType = null;
                        switch (editorMethod.EventName)
                        {
                            case "PreCreate":
                                eventType = typeof(EventHandler<PreCreateEventArgs>);
                                break;
                            case "PostCreate":
                                eventType = typeof(EventHandler<PostCreateEventArgs>);
                                break;
                            case "PreEdit":
                                eventType = typeof(EventHandler<PreEditEventArgs>);
                                break;
                            case "PostEdit":
                                eventType = typeof(EventHandler<PostEditEventArgs>);
                                break;
                            case "PreRemove":
                                eventType = typeof(EventHandler<PreRemoveEventArgs>);
                                break;
                            case "PostRemove":
                                eventType = typeof(EventHandler<PostRemoveEventArgs>);
                                break;
                            case "PreSelect":
                                eventType = typeof(EventHandler<PreSelectEventArgs>);
                                break;
                        }
                        if(null!= eventType)
                        {
                            Delegate dele = Delegate.CreateDelegate(eventType,instance,
                            t.GetMethod(editorMethod.MethodName, BindingFlags.Public | BindingFlags.Instance),true);
                            evtInfo.AddEventHandler(editor, dele);
                        }
                    }
                }

                var response = editor.Process(request).Data();
                return Json(response);
            }
        }

        public IHttpActionResult Export()
        {
            return Content<string>(HttpStatusCode.OK, "path");
        }
    }
}
