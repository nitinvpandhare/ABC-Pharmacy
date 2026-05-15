// This is the entry point for all medicine-related API requests.
// When the frontend JavaScript calls /api/medicines, it lands here first.
//
// The Controller's only job is to:
//   - Receive the HTTP request
//   - Pass the data to the Service
//   - Return the right HTTP response (200 OK, 404 Not Found, etc.)
//
// The Controller doesn't know HOW medicines are stored — that's the Service's job.

using Microsoft.AspNetCore.Mvc;
using PharmacyApp.API.Models;
using PharmacyApp.API.Services;

namespace PharmacyApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MedicinesController : ControllerBase
    {
        private readonly IMedicineService _service;

        public MedicinesController(IMedicineService service)
        {
            _service = service;
        }

        // GET /api/medicines
        // GET /api/medicines?search=para   ← search by name (optional)
        // Returns the full list of medicines. Staff use this to see what's in stock.
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] string? search = null)
        {
            var medicines = await _service.GetAllAsync(search);
            return Ok(medicines);
        }

        // GET /api/medicines/med-001
        // Fetch one specific medicine by its ID.
        // Returns 404 if the medicine doesn't exist.
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(string id)
        {
            var medicine = await _service.GetByIdAsync(id);
            return medicine == null ? NotFound() : Ok(medicine);
        }

        // POST /api/medicines
        // Add a brand new medicine to the system.
        // The frontend sends the medicine details in the request body as JSON.
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Medicine medicine)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            var created = await _service.AddAsync(medicine);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        // PUT /api/medicines/med-001
        // Update an existing medicine's details — e.g. a price change or stock adjustment.
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] Medicine medicine)
        {
            var updated = await _service.UpdateAsync(id, medicine);
            return updated == null ? NotFound() : Ok(updated);
        }

        // DELETE /api/medicines/med-001
        // Remove a medicine from the system entirely.
        // Returns 204 No Content on success (nothing to send back).
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var deleted = await _service.DeleteAsync(id);
            return deleted ? NoContent() : NotFound();
        }
    }
}
