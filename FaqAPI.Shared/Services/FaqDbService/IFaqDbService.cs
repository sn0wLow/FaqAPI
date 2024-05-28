namespace FaqAPI.Shared
{
    public interface IFaqDBService
    {
        public Task<IEnumerable<Faq>> GetAllFaqsAsync();
        public Task AddAsync(Faq faq);
        public Task RemoveAsync(int id);
    }
}
