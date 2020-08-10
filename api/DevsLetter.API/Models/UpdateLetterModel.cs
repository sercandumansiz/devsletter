using System;
using System.Collections.Generic;
using DevsLetter.API.Enums;

namespace DevsLetter.API.Models
{
    public class UpdateLetterModel
    {
        public List<UpdateLetterItemModel> Items { get; set; }
    }

    public class UpdateLetterItemModel
    {
        public string Link { get; set; }
    }
}