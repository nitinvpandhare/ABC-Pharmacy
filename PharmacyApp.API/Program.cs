using PharmacyApp.API.Repositories;
using PharmacyApp.API.Services;

var builder = WebApplication.CreateBuilder(args);

// ---------- SERVICES ----------

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Our repositories (data access) and services (business logic)
builder.Services.AddScoped<IMedicineRepository, MedicineRepository>();
builder.Services.AddScoped<ISaleRepository, SaleRepository>();
builder.Services.AddScoped<IMedicineService, MedicineService>();
builder.Services.AddScoped<ISaleService, SaleService>();

// CORS — allows the Angular dev server (localhost:4200) to call this API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());
});

var app = builder.Build();

// ---------- ENSURE DATA FILES EXIST ----------
var dataDir = Path.Combine(AppContext.BaseDirectory, "Data");
Directory.CreateDirectory(dataDir);

var medFile  = Path.Combine(dataDir, "medicines.json");
var saleFile = Path.Combine(dataDir, "sales.json");
if (!File.Exists(medFile))  File.WriteAllText(medFile,  "[]");
if (!File.Exists(saleFile)) File.WriteAllText(saleFile, "[]");

// ---------- MIDDLEWARE PIPELINE ----------

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "ABC Pharmacy API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.MapGet("/", () => Results.Ok(new {
    status  = "running",
    message = "ABC Pharmacy API is up!",
    swagger = "/swagger",
    hint    = "Run Angular separately: cd pharmacy-app && npm start"
}));

app.Run();
