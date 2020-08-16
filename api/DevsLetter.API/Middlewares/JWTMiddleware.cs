using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace DevsLetter.API.Middlewares
{
    public class JWTMiddleware : IMiddleware
    {
        private readonly HttpClient _httpClient;
        public JWTMiddleware()
        {
            _httpClient = new HttpClient();
            _httpClient.BaseAddress = new Uri("https://devsletter-auth.herokuapp.com/");
        }

        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            bool hasAuthorizationHeader = context.Request.Headers.ContainsKey("Authorization");

            if (hasAuthorizationHeader)
            {
                string token = context.Request.Headers.GetCommaSeparatedValues("Authorization").FirstOrDefault().Split("Bearer ")[1];

                var response = await _httpClient.GetAsync($"api/users/introspect/{token}");

                if (response.IsSuccessStatusCode)
                {
                    await next(context);

                    return;
                }
            }

            context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
        }
    }
}
