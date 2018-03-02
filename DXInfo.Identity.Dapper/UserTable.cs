using Dapper;

namespace DXInfo.Identity.Dapper
{
    public class UserTable<TUser> where TUser : IdentityUser
    {
        private IdentityDbContext db;
        public UserTable(IdentityDbContext database)
        {
            db = database;
        }

        public string GetUserName(int id)
        {
            return db.Connection.ExecuteScalar<string>("SELECT Name FROM Users WHERE Id=@Id", new { Id = id });
        }

        public int GetUserId(string userName)
        {
            return db.Connection.ExecuteScalar<int>("SELECT Id FROM Users WHERE UserName=@UserName", new { UserName = userName });
        }

        public TUser GetUserById(int id)
        {
            return db.Connection.QueryFirstOrDefault<TUser>("SELECT * FROM Users WHERE Id=@Id", new { Id = id });
        }

        public TUser GetUserByName(string userName)
        {
            return db.Connection.QueryFirstOrDefault<TUser>("SELECT * FROM Users WHERE UserName=@UserName", new { UserName = userName });
        }

        public TUser GetUserByEmail(string email)
        {
            return null;
        }

        public string GetPasswordHash(int id)
        {
            return db.Connection.ExecuteScalar<string>("SELECT PasswordHash FROM Users WHERE Id = @Id", new { Id = id });
        }

        public void SetPasswordHash(int id, string passwordHash)
        {
            db.Connection.Execute(@"UPDATE Users SET PasswordHash = @PasswordHash WHERE Id = @Id",
                new { PasswordHash = passwordHash, Id = id });
        }

        public string GetSecurityStamp(int id)
        {
            return db.Connection.ExecuteScalar<string>("SELECT SecurityStamp FROM Users WHERE Id = @Id",
                new { Id = id });
        }

        public void Insert(TUser user)
        {
            var id = db.Connection.ExecuteScalar<int>("DECLARE @T TABLE(Id int NOT NULL);"
 + " INSERT INTO Users(UserName,FullName,DeptId,WhId,AuthorityType,"
 + " PasswordHash, SecurityStamp,Email,EmailConfirmed,PhoneNumber,"
 + " PhoneNumberConfirmed, AccessFailedCount,LockoutEnabled,LockoutEndDateUtc,TwoFactorEnabled)"
 + " OUTPUT INSERTED.Id INTO @T"
 + " VALUES(@UserName,@FullName,@DeptId,@WhId,@AuthorityType, @PasswordHash, @SecurityStamp,"
 + " @Email,@EmailConfirmed,@PhoneNumberConfirmed,@phonenumberconfirmed,"
 + " @AccessFailedCount,@LockoutEnabled,@LockoutEndDateUtc,@TwoFactorEnabled);"
 + " SELECT Id FROM @T;",
                              new
                              {
                                  UserName = user.UserName,
                                  FullName = user.FullName,
                                  DeptId = user.DeptId,
                                  WhId = user.WhId,
                                  AuthorityType = user.AuthorityType,
                                  PasswordHash = user.PasswordHash,
                                  SecurityStamp = user.SecurityStamp,
                                  Email = user.Email,
                                  EmailConfirmed = user.EmailConfirmed,
                                  PhoneNumber = user.PhoneNumber,
                                  PhoneNumberConfirmed = user.PhoneNumberConfirmed,
                                  AccessFailedCount = user.AccessFailedCount,
                                  LockoutEnabled = user.LockoutEnabled,
                                  LockoutEndDateUtc = user.LockoutEndDateUtc,
                                  TwoFactorEnabled = user.TwoFactorEnabled
                              });

            user.Id = id;
        }

        private void Delete(int id)
        {
            db.Connection.Execute(@"DELETE FROM Users WHERE Id = @id", new { Id = id });
        }

        public void Delete(TUser user)
        {
            Delete(user.Id);
        }

        public void Update(TUser user)
        {
            db.Connection.Execute("Update Users set UserName = @UserName, PasswordHash = @PasswordHash,"
+ " SecurityStamp = @SecurityStamp,"
+ " Email=@Email, EmailConfirmed=@EmailConfirmed, PhoneNumber=@PhoneNumber,"
+ " PhoneNumberConfirmed=@PhoneNumberConfirmed,"
+ " AccessFailedCount=@AccessFailedCount, LockoutEnabled=@LockoutEnabled, LockoutEndDateUtc=@LockoutEndDateUtc,"
+ " TwoFactorEnabled=@TwoFactorEnabled  WHERE Id = @Id",
                new
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    FullName = user.FullName,
                    DeptId = user.DeptId,
                    WhId = user.WhId,
                    AuthorityType = user.AuthorityType,
                    PasswordHash = user.PasswordHash,
                    SecurityStamp = user.SecurityStamp,
                    Email = user.Email,
                    EmailConfirmed = user.EmailConfirmed,
                    PhoneNumber = user.PhoneNumber,
                    PhoneNumberConfirmed = user.PhoneNumberConfirmed,
                    AccessFailedCount = user.AccessFailedCount,
                    LockoutEnabled = user.LockoutEnabled,
                    LockoutEndDateUtc = user.LockoutEndDateUtc,
                    TwoFactorEnabled = user.TwoFactorEnabled
                }
           );
        }
    }
}
