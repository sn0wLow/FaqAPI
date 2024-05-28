using FaqAPI.Shared;
using Moq;

namespace FaqAPI.Tests
{
    public class FaqServiceTests
    {
        private readonly Mock<IFaqDBService> _mockFaqDbService;
        private readonly FaqService _faqService;

        public FaqServiceTests()
        {
            _mockFaqDbService = new Mock<IFaqDBService>();
            _faqService = new FaqService(_mockFaqDbService.Object);
        }

        [Fact]
        public async Task CreateAsync_CreateNewFaq()
        {
            var questionDTO = new QuestionDTO 
            { 
                Question = "What is XUnit?", 
                Answer = "A testing framework", Tags = ["testing", "csharp", ".net"]
            };

            _mockFaqDbService.Setup(s => s.AddAsync(It.IsAny<Faq>())).Returns(Task.CompletedTask);

            var result = await _faqService.CreateAsync(questionDTO);

            _mockFaqDbService
                .Verify(s => 
                s.AddAsync(It.Is<Faq>(f => f.Question == questionDTO.Question && 
                f.Answer == questionDTO.Answer)), Times.Once);

            Assert.NotNull(result);
            Assert.Equal(questionDTO.Question, result.Question);
            Assert.Equal(questionDTO.Answer, result.Answer);
        }

        [Fact]
        public async Task DeleteByIdAsync_ReturnsTrue()
        {
            var faqs = new List<Faq> { new() { Id = 1, Question = "Existing FAQ" } };
            _mockFaqDbService.Setup(s => s.GetAllFaqsAsync()).ReturnsAsync(faqs);
            _mockFaqDbService.Setup(s => s.RemoveAsync(1)).Returns(Task.CompletedTask);

            var result = await _faqService.DeleteByIdAsync(1);

            Assert.True(result);
            _mockFaqDbService.Verify(s => s.RemoveAsync(1), Times.Once);
        }

        [Fact]
        public async Task DeleteByIdAsync_ReturnsFalse()
        {
            _mockFaqDbService.Setup(s => s.GetAllFaqsAsync()).ReturnsAsync([]);

            var result = await _faqService.DeleteByIdAsync(1);

            Assert.False(result);
            _mockFaqDbService.Verify(s => s.RemoveAsync(It.IsAny<int>()), Times.Never);
        }

        [Fact]
        public async Task GetAllAsync_ReturnsAllFaqs()
        {
            var faqs = new List<Faq> { new() { Id = 1, Question = "Test FAQ" } };
            _mockFaqDbService.Setup(s => s.GetAllFaqsAsync()).ReturnsAsync(faqs);

            var result = await _faqService.GetAllAsync();

            Assert.Single(result);
            Assert.Equal("Test FAQ", result.First().Question);
        }

        [Fact]
        public async Task GetByIdAsync_ReturnsFaq_Existant()
        {
            var faqs = new List<Faq> { new() { Id = 1, Question = "Test FAQ" } };
            _mockFaqDbService.Setup(s => s.GetAllFaqsAsync()).ReturnsAsync(faqs);

            var result = await _faqService.GetByIdAsync(1);

            Assert.NotNull(result);
            Assert.Equal("Test FAQ", result.Question);
        }

        [Fact]
        public async Task GetByIdAsync_ReturnsFaq_NotExistant()
        {
            _mockFaqDbService.Setup(s => s.GetAllFaqsAsync()).ReturnsAsync([]);

            var result = await _faqService.GetByIdAsync(1);

            Assert.Null(result);
        }
    }
}