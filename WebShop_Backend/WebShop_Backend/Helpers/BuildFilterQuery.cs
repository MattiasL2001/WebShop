using Dapper;
using WebShop_Backend.Dtos.Product;
using System.Text;

namespace WebShop_Backend.Helpers
{
    public static class BuildFilterQuery
    {
        public static (string whereClause, DynamicParameters parameters) Build(FilterDto filterDto)
        {
            var sql = new StringBuilder();
            var parameters = new DynamicParameters();

            sql.Append("WHERE 1=1 ");

            if (!string.IsNullOrWhiteSpace(filterDto?.Search))
            {
                sql.Append("AND (LOWER(Name) LIKE @Search OR LOWER(Description) LIKE @Search) ");
                parameters.Add("@Search", $"%{filterDto.Search.Trim().ToLower()}%");
            }

            if (filterDto?.Type != null)
            {
                sql.Append("AND ProductType = @Type ");
                parameters.Add("@Type", filterDto.Type);
            }

            if (filterDto?.Color != null)
            {
                sql.Append("AND ProductColor = @Color ");
                parameters.Add("@Color", filterDto.Color);
            }

            if (filterDto?.Gender != null)
            {
                sql.Append("AND ProductGender = @Gender ");
                parameters.Add("@Gender", filterDto.Gender);
            }

            return (sql.ToString(), parameters);
        }
    }
}