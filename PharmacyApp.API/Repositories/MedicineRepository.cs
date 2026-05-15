using PharmacyApp.API.Models;
using System.Text.Json;

namespace PharmacyApp.API.Repositories
{
    public interface IMedicineRepository
    {
        Task<List<Medicine>> GetAllAsync();
        Task<Medicine?> GetByIdAsync(string id);
        Task<Medicine> AddAsync(Medicine medicine);
        Task<Medicine?> UpdateAsync(string id, Medicine medicine);
        Task<bool> DeleteAsync(string id);
    }

    public class MedicineRepository : IMedicineRepository
    {
        // The full path to our medicines.json file on disk
        private readonly string _filePath;

        private readonly JsonSerializerOptions _jsonOptions;

        public MedicineRepository(IConfiguration config)
        {
            _filePath = Path.Combine(AppContext.BaseDirectory, "Data", "medicines.json");
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true, 
                WriteIndented = true               
            };
        }

        private async Task<List<Medicine>> ReadFileAsync()
        {
            if (!File.Exists(_filePath)) return new List<Medicine>();
            var json = await File.ReadAllTextAsync(_filePath);
            return JsonSerializer.Deserialize<List<Medicine>>(json, _jsonOptions) ?? new List<Medicine>();
        }

        private async Task WriteFileAsync(List<Medicine> medicines)
        {
            var json = JsonSerializer.Serialize(medicines, _jsonOptions);
            await File.WriteAllTextAsync(_filePath, json);
        }

        public async Task<List<Medicine>> GetAllAsync() => await ReadFileAsync();

        public async Task<Medicine?> GetByIdAsync(string id)
        {
            var medicines = await ReadFileAsync();
            return medicines.FirstOrDefault(m => m.Id == id);
        }

        public async Task<Medicine> AddAsync(Medicine medicine)
        {
            var medicines = await ReadFileAsync();
            medicine.Id = Guid.NewGuid().ToString();
            medicine.CreatedAt = DateTime.UtcNow;
            medicines.Add(medicine);
            await WriteFileAsync(medicines);
            return medicine;
        }

        public async Task<Medicine?> UpdateAsync(string id, Medicine updated)
        {
            var medicines = await ReadFileAsync();
            var index = medicines.FindIndex(m => m.Id == id);
            if (index == -1) return null; 
            updated.Id = id;
            updated.CreatedAt = medicines[index].CreatedAt;
            medicines[index] = updated;
            await WriteFileAsync(medicines);
            return updated;
        }

        public async Task<bool> DeleteAsync(string id)
        {
            var medicines = await ReadFileAsync();
            var removed = medicines.RemoveAll(m => m.Id == id);
            if (removed > 0) await WriteFileAsync(medicines);
            return removed > 0; 
        }
    }
}
