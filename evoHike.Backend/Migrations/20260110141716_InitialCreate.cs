using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace evoHike.Backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Routes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    ShortDescription = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    RoutePlan = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CoverPhotoPath = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Length = table.Column<double>(type: "float", nullable: false),
                    EstimatedDuration = table.Column<int>(type: "int", nullable: false),
                    ElevationGain = table.Column<int>(type: "int", nullable: false),
                    PointsOfInterests = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Routes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PlannedHikes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RouteId = table.Column<int>(type: "int", nullable: false),
                    PlannedStartDateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PlannedEndDateTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Status = table.Column<byte>(type: "tinyint", nullable: false),
                    CompletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlannedHikes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PlannedHikes_Routes_RouteId",
                        column: x => x.RouteId,
                        principalTable: "Routes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PlannedHikes_RouteId",
                table: "PlannedHikes",
                column: "RouteId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PlannedHikes");

            migrationBuilder.DropTable(
                name: "Routes");
        }
    }
}
