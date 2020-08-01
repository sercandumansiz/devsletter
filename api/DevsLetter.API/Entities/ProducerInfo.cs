using MongoDB.Bson.Serialization.Attributes;

namespace DevsLetter.API.Entities
{
    public class ProducerInfo
    {
        [BsonElement("Username")]
        public string Username { get; set; }
        [BsonElement("ReferenceLink")]
        public string ReferenceLink { get; set; }
        [BsonElement("Note")]
        public string Note { get; set; }
    }
}