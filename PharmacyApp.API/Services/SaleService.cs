using PharmacyApp.API.Models;
using PharmacyApp.API.Repositories;

namespace PharmacyApp.API.Services
{
    public interface ISaleService
    {
        Task<List<SaleRecord>> GetAllAsync();
        Task<SaleRecord?> AddAsync(SaleRecord sale);
    }

    public class SaleService : ISaleService
    {
        private readonly ISaleRepository _saleRepo;
        private readonly IMedicineRepository _medicineRepo;

        // We need both repositories — one to write the sale, one to update stock
        public SaleService(ISaleRepository saleRepo, IMedicineRepository medicineRepo)
        {
            _saleRepo = saleRepo;
            _medicineRepo = medicineRepo;
        }

        // Simple — just fetch all the sale records and return them
        public Task<List<SaleRecord>> GetAllAsync() => _saleRepo.GetAllAsync();

        public async Task<SaleRecord?> AddAsync(SaleRecord sale)
        {
          
            var medicine = await _medicineRepo.GetByIdAsync(sale.MedicineId);
            if (medicine == null) return null;

            if (medicine.Quantity < sale.QuantitySold) return null;

            sale.MedicineName = medicine.FullName;
            sale.PricePerUnit = medicine.Price;
            sale.TotalAmount = medicine.Price * sale.QuantitySold;

            medicine.Quantity -= sale.QuantitySold;
            await _medicineRepo.UpdateAsync(medicine.Id, medicine);

            return await _saleRepo.AddAsync(sale);
        }
    }
}
