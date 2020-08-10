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
    [Route("api/letters")]
    public class LetterController : ControllerBase
    {
        private readonly IDevsLetterService _devsLetterService;
        public LetterController(IDevsLetterService devsLetterService)
        {
            _devsLetterService = devsLetterService;
        }

        [HttpPut("{id}")]
        [Authorize(Roles = Role.Producer)]
        public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] LetterUpdateRequest request)
        {
            if (id == Guid.Empty)
            {
                return BadRequest();
            }

            if (request == null || request.Items == null || request.Items.Count == 0)
            {
                return BadRequest();
            }

            UpdateLetterModel model = new UpdateLetterModel();

            model.Items = new List<UpdateLetterItemModel>();

            foreach (var item in request.Items)
            {
                model.Items.Add(new UpdateLetterItemModel()
                {
                    Link = item.Link
                });
            }

            var result = await _devsLetterService.UpdateLetter(id, model);

            if (result.HasError)
            {
                return BadRequest(result.ErrorMessage);
            }

            return Ok(result.Data);
        }
    }
}