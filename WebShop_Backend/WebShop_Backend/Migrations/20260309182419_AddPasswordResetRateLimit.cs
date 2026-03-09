using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace WebShop_Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddPasswordResetRateLimit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastPasswordResetRequest",
                table: "Users",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastPasswordResetRequest",
                table: "Users");
        }
    }
}
