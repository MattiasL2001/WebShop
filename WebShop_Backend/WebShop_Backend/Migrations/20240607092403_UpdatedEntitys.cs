using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebShop_Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedEntitys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Username",
                table: "Users",
                newName: "LastName");

            migrationBuilder.RenameColumn(
                name: "PriceTotal",
                table: "Users",
                newName: "FirstName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "LastName",
                table: "Users",
                newName: "Username");

            migrationBuilder.RenameColumn(
                name: "FirstName",
                table: "Users",
                newName: "PriceTotal");
        }
    }
}
