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

                int dayOfWeek = (int)DateTime.Now.DayOfWeek;
                int restDaysOfWeek = 6 - dayOfWeek;

                DateTime currentWeekStartDate = DateTime.Now.AddDays(-(dayOfWeek + 1));
                DateTime currentWeekEndDate = DateTime.Now.AddDays((restDaysOfWeek + 1));

                var filterBuilder = Builders<Letter>.Filter;

                var filter = filterBuilder.Eq(t => t.User.Id, model.UserId) &
                             filterBuilder.Gte(t => t.CreatedAt, currentWeekStartDate) &
                             filterBuilder.Lte(t => t.CreatedAt, currentWeekEndDate);

                var hasLetter = await _devsLetters.Find(filter).AnyAsync();

                if (hasLetter)
                {
                    result.HasError = true;
                    result.ErrorMessage = "Already has a letter for this week.";

                    return result;
                }

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

                // TODO : return ID
                result.Data = model;

            }
            catch
            {
                throw new SystemException("Something went wrong while creating letter.");
            }

            return result;
        }

        public async Task<BaseModel<LetterModel>> GetWeeklyLetter(Guid userId)
        {
            BaseModel<LetterModel> result = new BaseModel<LetterModel>();

            try
            {
                int dayOfWeek = (int)DateTime.Now.DayOfWeek;
                int restDaysOfWeek = 6 - dayOfWeek;

                DateTime currentWeekStartDate = DateTime.Now.AddDays(-(dayOfWeek + 1));
                DateTime currentWeekEndDate = DateTime.Now.AddDays((restDaysOfWeek + 1));

                var filterBuilder = Builders<Letter>.Filter;

                var filter = filterBuilder.Eq(t => t.User.Id, userId) &
                             filterBuilder.Gte(t => t.CreatedAt, currentWeekStartDate) &
                             filterBuilder.Lte(t => t.CreatedAt, currentWeekEndDate);

                var letter = await _devsLetters.Find(filter).FirstOrDefaultAsync();

                if (letter != null)
                {
                    var model = new LetterModel();

                    model.Id = letter.Id;

                    model.UserId = userId;

                    model.Status = letter.Status;

                    model.CreatedAt = letter.CreatedAt;

                    model.Items = new List<LetterItemModel>();

                    foreach (var item in letter.Items)
                    {
                        model.Items.Add(new LetterItemModel() { Link = item.Link });
                    }

                    result.Data = model;
                }
            }
            catch
            {
                throw new SystemException("Something went wrong while reading letter.");
            }

            return result;
        }

        public async Task<BaseModel<LetterModel>> UpdateLetter(Guid id, UpdateLetterModel model)
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

                Letter letter = new Letter();

                letter.Items = new List<LetterItem>();

                foreach (var item in model.Items)
                {
                    letter.Items.Add(new LetterItem()
                    {
                        Link = item.Link
                    });
                }

                var filter = Builders<Letter>.Filter.Eq("Id", id);

                var updateLetterItems = Builders<Letter>.Update.Set("Items", letter.Items);
                var updateLetterUpdatedAt = Builders<Letter>.Update.Set("UpdatedAt", DateTime.UtcNow);

                var updateLetterItemsResult = await _devsLetters.UpdateOneAsync(filter, updateLetterItems);
                var updateLetterUpdatedAtResult = await _devsLetters.UpdateOneAsync(filter, updateLetterUpdatedAt);

                if (updateLetterItemsResult.IsAcknowledged && updateLetterUpdatedAtResult.IsAcknowledged)
                {
                    result.Data = new LetterModel();
                    result.Data.Items = new List<LetterItemModel>();
                    var updatedLetter = await _devsLetters.Find(filter).FirstOrDefaultAsync();

                    foreach (var item in updatedLetter.Items)
                    {
                        result.Data.Items.Add(new LetterItemModel()
                        {
                            Link = item.Link
                        });
                    }

                    result.Data.CreatedAt = updatedLetter.CreatedAt;
                    result.Data.UpdatedAt = updatedLetter.UpdatedAt;
                    result.Data.Status = updatedLetter.Status;
                    result.Data.UserId = updatedLetter.User.Id;
                }
                else
                {
                    throw new SystemException("Something went wrong while updating letter.");
                }
            }
            catch
            {
                throw new SystemException("Something went wrong while updating letter.");
            }

            return result;
        }
    }
}