﻿namespace FaqAPI.Shared
{
    public class Faq
    {
        public int Id { get; set; }

        public string? Question { get; set; }

        public string? Answer { get; set; }

        public IEnumerable<string>? Tags { get; set; }
    }
}
