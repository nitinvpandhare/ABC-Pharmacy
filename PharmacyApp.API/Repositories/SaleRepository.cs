using PharmacyApp.API.Models;
using System.Text.Json;

namespace PharmacyApp.API.Repositories
{
    public interface ISaleRepository
    {
        Task<List<SaleRecord>> GetAllAsync();
        Task<SaleRecord> AddAsync(SaleRecord sale);
    }

    public class SaleRepository : ISaleRepository
    {
        private readonly string _filePath;
        private readonly JsonSerializerOptions _jsonOptions;

        public SaleRepository(IConfiguration config)
        {
            _filePath = Path.Combine(AppContext.BaseDirectory, "Data", "sales.json");
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                WriteIndented = true
            };
        }

        private async Task<List<SaleRecord>> ReadFileAsync()
        {
            if (!File.Exists(_filePath)) return new List<SaleRecord>();
            var json = await File.ReadAllTextAsync(_filePath);
            return JsonSerializer.Deserialize<List<SaleRecord>>(json, _jsonOptions) ?? new List<SaleRecord>();
        }

        private async Task WriteFileAsync(List<SaleRecord> sales)
        {
            var json = JsonSerializer.Serialize(sales, _jsonOptions);
            await File.WriteAllTextAsync(_filePath, json);
        }
        public async Task<List<SaleRecord>> GetAllAsync() => await ReadFileAsync();

        public async Task<SaleRecord> AddAsync(SaleRecord sale)
        {
            var sales = await ReadFileAsync();
            sale.Id = Guid.NewGuid().ToString();
            sale.SaleDate = DateTime.UtcNow;
            sales.Add(sale);
            await WriteFileAsync(sales);
            return sale;
        }
    }
}
