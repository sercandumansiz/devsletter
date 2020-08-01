using System;
using System.Threading.Tasks;
using DevsLetter.API.Constants;
using DevsLetter.API.Models.Requests;
using DevsLetter.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DevsLetter.API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("{id}/producer/become")]
        [Authorize(Roles = Role.Observer)]
        public async Task<IActionResult> BecomeProducer([FromRoute] Guid id, [FromBody] ProducerSignUpRequest request)
        {
            var result = await _userService.BecomeProducer(id, request.Username, request.ReferenceLink, request.Note);

            return Ok();
        }
    }
}