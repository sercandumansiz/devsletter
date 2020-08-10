using System;
using System.Collections.Generic;
using DevsLetter.API.Enums;

namespace DevsLetter.API.Models
{
    public class LetterModel
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public List<LetterItemModel> Items { get; set; }
        public LetterStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

    public class LetterItemModel
    {
        public string Link { get; set; }
    }
}