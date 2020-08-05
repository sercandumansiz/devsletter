using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DevsLetter.API.Constants;
using DevsLetter.API.Entities;
using DevsLetter.API.Enums;
using DevsLetter.API.Models;
using MongoDB.Driver;

namespace DevsLetter.API.Services.Implementations
{
    public class DevsLetterService : IDevsLetterService
    {
        private readonly IMongoCollection<Letter> _devsLetters;
        private readonly IMongoCollection<User> _users;

        public DevsLetterService(IStartupAuthDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _devsLetters = database.GetCollection<Letter>(settings.DevsLettersCollectionName);
            _users = database.GetCollection<User>(settings.UsersCollectionName);
        }

        public async Task<BaseModel<LetterModel>> CreateLetter(LetterModel model)
        {
            BaseModel<LetterModel> result = new BaseModel<LetterModel>();

            try
            {
                if (model.Items == null || model.Items.Count != 3)
                {
                    result.HasError = true;
                    result.ErrorMessage = "Letter should contains 3 items";

                    return result;
                }

                var user = await _users.Find(u => u.Id == model.UserId).FirstOrDefaultAsync();

                if (user == null)
                {
                    result.HasError = true;
                    result.ErrorMessage = "User not found.";

                    return result;
                }

                // TODO: week check

                Letter letter = new Letter();

                letter.Items = new List<LetterItem>();

                foreach (var item in model.Items)
                {
                    letter.Items.Add(new LetterItem()
                    {
                        Link = item.Link
                    });
                }

                letter.User = user;

                letter.Status = LetterStatus.WaitingForApproval;

                letter.CreatedAt = DateTime.UtcNow;

                await _devsLetters.InsertOneAsync(letter);

            }
            catch
            {
                throw new SystemException("Something went wrong while creating letter.");
            }

            return result;
        }

        public Task<BaseModel<LetterModel>> GetWeeklyLetter(Guid userId)
        {
            throw new NotImplementedException();
        }
    }
}