using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebShop_Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddedProductAmounttoOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProductAmount",
                table: "Orders",
                type: "TEXT",
                nullable: false,
                defaultValue: "[]");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProductAmount",
                table: "Orders");
        }
    }
}
