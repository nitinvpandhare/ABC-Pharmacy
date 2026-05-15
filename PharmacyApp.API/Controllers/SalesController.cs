// This controller handles everything related to sales transactions.
// It's simpler than the medicines controller — we only need to view and create sales,
// never edit or delete them (sales are permanent records).

using Microsoft.AspNetCore.Mvc;
using PharmacyApp.API.Models;
using PharmacyApp.API.Services;

namespace PharmacyApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SalesController : ControllerBase
    {
        private readonly ISaleService _service;

        public SalesController(ISaleService service)
        {
            _service = service;
        }

        // GET /api/sales
        // Returns the complete list of all sale transactions ever made.
        // The frontend sorts these newest-first so staff see recent sales at the top.
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var sales = await _service.GetAllAsync();
            return Ok(sales);
        }

        // POST /api/sales
        // Record a new sale at the counter.
        // The service will:
        //   - Verify the medicine exists and stock is sufficient
        //   - Calculate the total amount
        //   - Deduct the stock from the medicine
        //   - Save the sale record
        //
        // If stock is insufficient or the medicine doesn't exist,
        // we return a 400 Bad Request with a clear message.
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] SaleRecord sale)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var created = await _service.AddAsync(sale);

            if (created == null)
                return BadRequest(new { message = "Sale could not be completed. Either the medicine was not found or there is not enough stock available." });

            return Ok(created);
        }
    }
}
