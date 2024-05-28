using FaqAPI.Shared;
using Microsoft.AspNetCore.Mvc;

namespace FaqAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FaqController : ControllerBase
    {
        private readonly IFaqService _faqService;
        public FaqController(IFaqService faqService)
        {
            _faqService = faqService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAllAsync()
        {
            return Ok(await _faqService.GetAllAsync());
        }

        [HttpGet("GetById/{id}")]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            var result = await _faqService.GetByIdAsync(id);

            if (result is null)
            {
                return NotFound();
            }

            return Ok(result);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> CreateAsync(QuestionDTO newFaq)
        {
            return Ok(await _faqService.CreateAsync(newFaq));
        }

        [HttpDelete("DeleteById/{id}")]
        public async Task<IActionResult> DeleteByIdAsync(int id)
        {
            var result = await _faqService.DeleteByIdAsync(id);

            if (!result)
            {
                return BadRequest();
            }

            return Ok(true);
        }


    }
}
