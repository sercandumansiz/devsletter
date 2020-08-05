using System;
using System.Collections.Generic;
using DevsLetter.API.Enums;
using MongoDB.Bson.Serialization.Attributes;

namespace DevsLetter.API.Entities
{
    public class Letter
    {
        [BsonId]
        public Guid Id { get; set; }
        [BsonElement("User")]
        public User User { get; set; }
        [BsonElement("Items")]
        public List<LetterItem> Items { get; set; }
        [BsonElement("CreatedAt")]
        public DateTime CreatedAt { get; set; }
        [BsonElement("UpdatedAt")]
        public DateTime? UpdatedAt { get; set; }
        public LetterStatus Status { get; set; }
    }

    public class LetterItem
    {
        [BsonElement("Link")]
        public string Link { get; set; }
    }
}