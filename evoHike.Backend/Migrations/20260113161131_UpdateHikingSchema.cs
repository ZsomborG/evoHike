using System;
using Microsoft.EntityFrameworkCore.Migrations;
using NetTopologySuite.Geometries;

#nullable disable

namespace evoHike.Backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateHikingSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PlannedHikes_Routes_RouteId",
                table: "PlannedHikes");

            migrationBuilder.DropTable(
                name: "Routes");

            migrationBuilder.RenameColumn(
                name: "RouteId",
                table: "PlannedHikes",
                newName: "HikingTrailId");

            migrationBuilder.RenameIndex(
                name: "IX_PlannedHikes_RouteId",
                table: "PlannedHikes",
                newName: "IX_PlannedHikes_HikingTrailId");

            migrationBuilder.CreateTable(
                name: "HikingTrails",
                columns: table => new
                {
                    TrailID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TrailName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    TrailSymbol = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    StartLocation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    EndLocation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Network = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Wikidata = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Wikipedia = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Website = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Length = table.Column<double>(type: "float", nullable: false),
                    Difficulty = table.Column<int>(type: "int", nullable: false),
                    Elevation = table.Column<double>(type: "float", nullable: false),
                    Rating = table.Column<double>(type: "float", nullable: false),
                    ReviewCount = table.Column<int>(type: "int", nullable: false),
                    CoverPhotoPath = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    RouteLine = table.Column<Geometry>(type: "geography", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HikingTrails", x => x.TrailID);
                });

            migrationBuilder.CreateTable(
                name: "PointsOfInterest",
                columns: table => new
                {
                    POIID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    POIName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    POIType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Location = table.Column<Point>(type: "geography", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PointsOfInterest", x => x.POIID);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_PlannedHikes_HikingTrails_HikingTrailId",
                table: "PlannedHikes",
                column: "HikingTrailId",
                principalTable: "HikingTrails",
                principalColumn: "TrailID",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PlannedHikes_HikingTrails_HikingTrailId",
                table: "PlannedHikes");

            migrationBuilder.DropTable(
                name: "HikingTrails");

            migrationBuilder.DropTable(
                name: "PointsOfInterest");

            migrationBuilder.RenameColumn(
                name: "HikingTrailId",
                table: "PlannedHikes",
                newName: "RouteId");

            migrationBuilder.RenameIndex(
                name: "IX_PlannedHikes_HikingTrailId",
                table: "PlannedHikes",
                newName: "IX_PlannedHikes_RouteId");

            migrationBuilder.CreateTable(
                name: "Routes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CoverPhotoPath = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ElevationGain = table.Column<int>(type: "int", nullable: false),
                    EstimatedDuration = table.Column<int>(type: "int", nullable: false),
                    Length = table.Column<double>(type: "float", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    PointsOfInterests = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RoutePlan = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ShortDescription = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Routes", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_PlannedHikes_Routes_RouteId",
                table: "PlannedHikes",
                column: "RouteId",
                principalTable: "Routes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
