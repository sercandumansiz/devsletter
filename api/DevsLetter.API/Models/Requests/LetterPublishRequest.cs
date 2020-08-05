using System;
using System.Collections.Generic;
using DevsLetter.API.Enums;

namespace DevsLetter.API.Models.Requests
{
    public class LetterPublishRequest
    {
        public List<LetterItemRequest> Items { get; set; }
    }

    public class LetterItemRequest
    {
        public string Link { get; set; }
    }
}