using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DevsLetter.API.Constants;
using DevsLetter.API.Models;
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
        private readonly IDevsLetterService _devsLetterService;
        public UserController(IUserService userService, IDevsLetterService devsLetterService)
        {
            _userService = userService;
            _devsLetterService = devsLetterService;
        }

        [HttpPost("{id}/producer/become")]
        [Authorize(Roles = Role.Observer)]
        public async Task<IActionResult> BecomeProducer([FromRoute] Guid id, [FromBody] ProducerSignUpRequest request)
        {
            if (id == Guid.Empty)
            {
                return BadRequest();
            }

            var result = await _userService.BecomeProducer(id, request.Username, request.ReferenceLink, request.Note);

            return Ok();
        }

        [HttpPost("{id}/letter/publish")]
        [Authorize(Roles = Role.Producer)]
        public async Task<IActionResult> PublishLetter([FromRoute] Guid id, [FromBody] LetterPublishRequest request)
        {
            if (id == Guid.Empty)
            {
                return BadRequest();
            }

            if (request == null || request.Items == null || request.Items.Count == 0)
            {
                return BadRequest();
            }

            LetterModel model = new LetterModel();

            model.UserId = id;
            model.Items = new List<LetterItemModel>();

            foreach (var item in request.Items)
            {
                model.Items.Add(new LetterItemModel()
                {
                    Link = item.Link
                });
            }

            var result = await _devsLetterService.CreateLetter(model);

            if (result.HasError)
            {
                return BadRequest(result.ErrorMessage);
            }

            return Ok(result.Data);
        }

        [HttpGet("{id}/letter")]
        [Authorize(Roles = Role.Producer)]
        public async Task<IActionResult> Letter([FromRoute] Guid id)
        {
            if (id == Guid.Empty)
            {
                return BadRequest();
            }

            var result = await _devsLetterService.GetWeeklyLetter(id);

            if (result.HasError)
            {
                return BadRequest(result.ErrorMessage);
            }

            return Ok(result.Data);
        }
    }
}