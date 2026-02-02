using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace evoHike.Backend.Migrations
{
    /// <inheritdoc />
    public partial class AddDurationAndCreatedToHikingTrail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "HikingTrails",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "EstimatedDuration",
                table: "HikingTrails",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "HikingTrails");

            migrationBuilder.DropColumn(
                name: "EstimatedDuration",
                table: "HikingTrails");
        }
    }
}
