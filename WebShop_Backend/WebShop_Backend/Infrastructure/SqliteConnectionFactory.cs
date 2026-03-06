using Microsoft.Data.Sqlite;
using System.Data;

namespace WebShop_Backend.Infrastructure
{
    public class SqliteConnectionFactory
    {
        private readonly string _connectionString;

        public SqliteConnectionFactory(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        public IDbConnection Create()
        {
            return new SqliteConnection(_connectionString);
        }
    }
}