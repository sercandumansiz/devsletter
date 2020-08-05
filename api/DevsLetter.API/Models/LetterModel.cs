using System;
using System.Collections.Generic;
using DevsLetter.API.Enums;

namespace DevsLetter.API.Models
{
    public class LetterModel
    {
        public Guid UserId { get; set; }
        public List<LetterItemModel> Items { get; set; }
    }

    public class LetterItemModel
    {
        public string Link { get; set; }
    }
}