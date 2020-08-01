using System;
using System.Threading.Tasks;
using DevsLetter.API.Models;

namespace DevsLetter.API.Services
{
    public interface IUserService
    {
        Task<BaseModel<bool>> BecomeProducer(Guid userId, string userName, string referenceLink, string note);
    }
}