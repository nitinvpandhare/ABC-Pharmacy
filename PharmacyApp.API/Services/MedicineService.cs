using PharmacyApp.API.Models;
using PharmacyApp.API.Repositories;

namespace PharmacyApp.API.Services
{
    public interface IMedicineService
    {
        Task<List<Medicine>> GetAllAsync(string? search = null);
        Task<Medicine?> GetByIdAsync(string id);
        Task<Medicine> AddAsync(Medicine medicine);
        Task<Medicine?> UpdateAsync(string id, Medicine medicine);
        Task<bool> DeleteAsync(string id);
    }

    public class MedicineService : IMedicineService
    {
        private readonly IMedicineRepository _repo;

        public MedicineService(IMedicineRepository repo)
        {
            _repo = repo;
        }

        public async Task<List<Medicine>> GetAllAsync(string? search = null)
        {
            var medicines = await _repo.GetAllAsync();

            if (!string.IsNullOrWhiteSpace(search))
                medicines = medicines
                    .Where(m => m.FullName.Contains(search, StringComparison.OrdinalIgnoreCase))
                    .ToList();

            return medicines;
        }

        public Task<Medicine?> GetByIdAsync(string id) => _repo.GetByIdAsync(id);
        public Task<Medicine> AddAsync(Medicine medicine) => _repo.AddAsync(medicine);
        public Task<Medicine?> UpdateAsync(string id, Medicine medicine) => _repo.UpdateAsync(id, medicine);
        public Task<bool> DeleteAsync(string id) => _repo.DeleteAsync(id);
    }
}
