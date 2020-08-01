using System;
using System.Threading.Tasks;
using DevsLetter.API.Constants;
using DevsLetter.API.Entities;
using DevsLetter.API.Models;
using MongoDB.Driver;

namespace DevsLetter.API.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IMongoCollection<User> _users;

        public UserService(IStartupAuthDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _users = database.GetCollection<User>(settings.UsersCollectionName);
        }

        public async Task<BaseModel<bool>> BecomeProducer(Guid userId, string userName, string referenceLink, string note)
        {
            BaseModel<bool> result = new BaseModel<bool>();

            try
            {
                var filter = Builders<User>.Filter.Eq("Id", userId);

                ProducerInfo producerInfo = new ProducerInfo()
                {
                    Username = userName,
                    ReferenceLink = referenceLink,
                    Note = note
                };

                var updateProducerInfo = Builders<User>.Update.Set("ProducerInfo", producerInfo);
                var updateRole = Builders<User>.Update.Set("Role", Role.Producer);

                var updateProducerInfoResult = await _users.UpdateOneAsync(filter, updateProducerInfo);
                var updateRoleResult = await _users.UpdateOneAsync(filter, updateRole);

                if (updateProducerInfoResult.IsAcknowledged && updateRoleResult.IsAcknowledged)
                {
                    result.Data = true;
                }
                else
                {
                    throw new SystemException("Something went wrong while updating user.");
                }
            }
            catch
            {
                throw new SystemException("Something went wrong while updating user.");
            }

            return result;
        }
    }
}