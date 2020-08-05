namespace DevsLetter.API.Models
{
    public class StartupAuthDatabaseSettings : IStartupAuthDatabaseSettings
    {
        public string DevsLettersCollectionName { get; set; }
        public string UsersCollectionName { get; set; }
        public string ConnectionString { get; set; }
        public string DatabaseName { get; set; }
    }

    public interface IStartupAuthDatabaseSettings
    {
        string DevsLettersCollectionName { get; set; }
        string UsersCollectionName { get; set; }
        string ConnectionString { get; set; }
        string DatabaseName { get; set; }
    }
}
