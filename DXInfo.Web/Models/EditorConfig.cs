using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DXInfo.Web.Models
{
    public class EditorConfig
    {
        public string Table { get; set; }
        public string Pkey { get; set; }
        public string IdPrefix { get; set; }
        public bool TryCatch { get; set; }
        public List<EditorField> Fields { get; set; }
        public List<EditorLeftJoin> LeftJoins { get; set; }
        public List<EditorWhere> Wheres { get; set; }
        public EditorMJoin MJoin { get; set; }
        public EditorEvent Event { get; set; }
        public EditorConfig()
        {
            this.Table = string.Empty;
            this.Pkey = "Id";
            this.IdPrefix = string.Empty;
            this.TryCatch = false;
            this.Fields = new List<EditorField>();
            this.LeftJoins = new List<EditorLeftJoin>();
            this.Wheres = new List<EditorWhere>();
        }
    }
    public class EditorField
    {
        public string DbField { get; set; }
        //public string Name { get; set; }
        public string Type { get; set; }
        //public string TypeError { get; set; }
        public string GetFormatter { get; set; }
        public string SetFormatter { get; set; }
        public List<EditorValidator> Validators { get; set; }
        public EditorOptions Options { get; set; }
        //public bool IsAggregate { get; set; }
        public bool Group { get; set; }
        public EditorField()
        {
            this.DbField = string.Empty;
            //this.Name = string.Empty;
            this.Type = string.Empty;
            //this.IsAggregate = false;
            //this.TypeError = string.Empty;
            //this.GetFormatter = new EditorFormatter();
            //this.SetFormatter = new EditorFormatter();
            this.Group = false;

        }
    }
    public class EditorFormatter
    {
        public string Name { get; set; }
        public string Parameter { get; set; }
        public EditorFormatter()
        {
            this.Name = string.Empty;
            this.Parameter = string.Empty;
        }
    }
    public class EditorValidator
    {
        public string Name { get; set; }
        public string Message { get; set; }
        public string Format { get; set; }
        public EditorValidator()
        {
            this.Name = string.Empty;
            this.Message = string.Empty;
            this.Format = string.Empty;
        }
    }
    public class EditorLeftJoin
    {
        public string Table { get; set; }
        public string Field1 { get; set; }
        public string Op { get; set; }
        public string Field2 { get; set; }
        public bool IsCondition { get; set; }
        public string Condition { get; set; }
        public EditorLeftJoin()
        {
            this.Table = string.Empty;
            this.Field1 = string.Empty;
            this.Op = "=";
            this.Field2 = string.Empty;
            this.Condition = string.Empty;
            this.IsCondition = false;
        }
    }
    public class EditorOptions
    {
        public string Table { get; set; }
        public string Value { get; set; }
        public string Label { get; set; }
        public List<string> Labels { get; set; }
        public EditorCondition Condition { get; set; }
        public EditorOptions()
        {
            this.Table = string.Empty;
            this.Value = string.Empty;
            this.Labels = new List<string>();
            this.Condition = new EditorCondition();
        }
        
    }
    public class EditorCondition
    {
        public string Key { get; set; }
        public string Value { get; set; }
        public EditorCondition()
        {
            this.Key = string.Empty;
            this.Value = string.Empty;
        }
    }
    public class EditorWhere
    {
        public string Key { get; set; }
        public object Value { get; set; }
        public string Op { get; set; }
        public EditorWhere()
        {
            Key = string.Empty;
            Value = null;
            Op = "=";
        }
    }
    public class EditorEvent
    {
        //  "Event": {
        //  "FileName": "DXInfo.DataTables.Events.dll",
        //  "Type": "DXInfo.DataTables.Events.MixVouchEvents",
        //  "Methods": [
        //    {
        //      "EventName": "PreCreate",
        //      "MethodName": "PreMixVouchCreate"
        //    }
        //  ]
        //}
        //public string FileName { get; set; }
        public string Type { get; set; }
        public List<EditorMethod> Methods { get; set; }
    }
    public class EditorMethod
    {
        public string EventName { get; set; }
        public string MethodName { get; set; }
    }
    public class EditorMJoinLink
    {
        public string Field1 { get; set; }
        public string Field2 { get; set; }
        public EditorMJoinLink()
        {
            Field1 = string.Empty;
            Field2 = string.Empty;
        }
    }
    public class EditorMJoin
    {
        public string Table { get; set; }
        public EditorMJoinLink Link1 { get; set; }
        public EditorMJoinLink Link2 { get; set; }
        public List<EditorField> Fields { get; set; }

    }
}