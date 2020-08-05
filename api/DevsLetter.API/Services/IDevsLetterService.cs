using System;
using System.Threading.Tasks;
using DevsLetter.API.Models;

namespace DevsLetter.API.Services
{
    public interface IDevsLetterService
    {
        Task<BaseModel<LetterModel>> CreateLetter(LetterModel model);
        Task<BaseModel<LetterModel>> GetWeeklyLetter(Guid userId);
    }
}