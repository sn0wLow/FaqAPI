using System.Text.Json;

namespace FaqAPI.Shared
{
    public class FaqDBService : IFaqDBService
    {
        private readonly string _filePath;

        // Semaphore to avoid concurrent writes/reads
        private readonly SemaphoreSlim _semaphoreSlim;

        private int _maxId;


        public FaqDBService()
        {
            var wwwrootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            _filePath = Path.Combine(wwwrootPath, "faqs.json");

            _semaphoreSlim = new SemaphoreSlim(1, 1);


            if (!Directory.Exists(wwwrootPath))
            {
                Directory.CreateDirectory(wwwrootPath);
            }

            if (!File.Exists(_filePath))
            {
                File.WriteAllText(_filePath, JsonSerializer.Serialize(new List<Faq>()));
            }

            var faqs = ReadFaqsFromFile();

            if (faqs.Count == 0)
            {
                _maxId = 0;
            }
            else
            {
                _maxId = faqs.Max(x => x.Id);
            }
        }

        public async Task AddAsync(Faq faq)
        {
            await _semaphoreSlim.WaitAsync();

            try
            {
                var faqs = await ReadFaqsFromFileAsync();

                _maxId += 1;
                faq.Id = _maxId;

                faqs.Add(faq);

                await WriteFaqsToFileAsync(faqs);
            }
            finally
            {
                _semaphoreSlim.Release();
            }
        }

        public async Task RemoveAsync(int id)
        {
            await _semaphoreSlim.WaitAsync();

            try
            {
                var faqs = await ReadFaqsFromFileAsync();
                faqs.Remove(faqs.First(x => x.Id == id));

                await WriteFaqsToFileAsync(faqs);
            }
            finally
            {
                _semaphoreSlim.Release();
            }
        }

        public async Task<IEnumerable<Faq>> GetAllFaqsAsync()
        {
            await _semaphoreSlim.WaitAsync();

            try
            {
                return await ReadFaqsFromFileAsync();
            }
            finally
            {
                _semaphoreSlim.Release();
            }
        }

        private List<Faq> ReadFaqsFromFile()
        {
            return JsonSerializer.Deserialize<List<Faq>>(File.ReadAllText(_filePath)) ?? [];
        }

        private async Task<List<Faq>> ReadFaqsFromFileAsync()
        {
            using (FileStream stream = File.OpenRead(_filePath))
            {
                return await JsonSerializer.DeserializeAsync<List<Faq>>(stream) ?? [];
            }
        }

        private async Task WriteFaqsToFileAsync(List<Faq> faqs)
        {
            using (FileStream createStream = File.Create(_filePath))
            {
                var options = new JsonSerializerOptions { WriteIndented = true };

                await JsonSerializer.SerializeAsync(createStream, faqs, options);
            }
        }


    }
}
