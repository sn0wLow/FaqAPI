namespace FaqAPI.Shared
{
    public interface IFaqService
    {
        public Task<IEnumerable<Faq>> GetAllAsync();
        public Task<Faq?> GetByIdAsync(int id);
        public Task<Faq> CreateAsync(QuestionDTO questionDTO);
        public Task<bool> DeleteByIdAsync(int id);
    }
}
