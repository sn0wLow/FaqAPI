namespace FaqAPI.Shared
{
    public class FaqService : IFaqService
    {
        private readonly IFaqDBService _faqDBService;
        public FaqService(IFaqDBService faqDBService)
        {
            _faqDBService = faqDBService;
        }

        public async Task<Faq> CreateAsync(QuestionDTO questionDTO)
        {
            var newFaq = new Faq()
            {
                Question = questionDTO.Question,
                Answer = questionDTO.Answer,
                Tags = questionDTO.Tags,
            };

            await _faqDBService.AddAsync(newFaq);

            return newFaq;
        }

        public async Task<bool> DeleteByIdAsync(int id)
        {
            var faqs = await _faqDBService.GetAllFaqsAsync();


            if (faqs.Any(x => x.Id == id))
            {
                await _faqDBService.RemoveAsync(id);
                return true;
            }

            return false;
        }

        public async Task<IEnumerable<Faq>> GetAllAsync()
        {
            return await _faqDBService.GetAllFaqsAsync();
        }

        public async Task<Faq?> GetByIdAsync(int id)
        {
            return (await _faqDBService.GetAllFaqsAsync())
                .FirstOrDefault(x => x.Id == id);
        }
    }
}
