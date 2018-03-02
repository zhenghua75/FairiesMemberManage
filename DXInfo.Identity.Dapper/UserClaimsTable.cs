using Dapper;
using System.Security.Claims;

namespace DXInfo.Identity.Dapper
{
    public class UserClaimsTable
    {
        private IdentityDbContext db;
        public UserClaimsTable(IdentityDbContext database)
        {
            db = database;
        }
        public ClaimsIdentity FindByUserId(int userId)
        {
            ClaimsIdentity claims = new ClaimsIdentity();
            var q = db.Connection.Query("SELECT * FROM UserClaims WHERE UserId=@UserId",
               new { UserId = userId });
            foreach (var c in q)
            {
                claims.AddClaim(new Claim(c.ClaimType, c.ClaimValue));
            }

            return claims;
        }
        public void Delete(int userId)
        {
            db.Connection.Execute(@"DELETE FROM UserClaims WHERE UserId=@UserId", new { UserId = userId });
        }
        public void Insert(Claim claim, int userId)
        {
            db.Connection.Execute("ISNERT INTO UserClaims(ClaimValue,ClaimType,UserId)VALUES(@ClaimValue,@ClaimType,@UserId)",
                    new
                    {
                        ClaimValue = claim.Value,
                        ClaimType = claim.Type,
                        UserId = userId
                    });
        }
        public void Delete(int userId, Claim claim)
        {
            db.Connection.Execute("DELETE FROM UserClaims WHERE UserId = @UserId and @ClaimValue = @ClaimValue and ClaimType = @ClaimType",
                new
                {
                    UserId = userId,
                    ClaimValue = claim.Value,
                    ClaimType = claim.Type
                });
        }
    }
}
