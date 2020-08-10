using System;
using System.Collections.Generic;
using DevsLetter.API.Enums;

namespace DevsLetter.API.Models.Requests
{
    public class LetterUpdateRequest
    {
        public List<LetterUpdateItemRequest> Items { get; set; }
    }

    public class LetterUpdateItemRequest
    {
        public string Link { get; set; }
    }
}