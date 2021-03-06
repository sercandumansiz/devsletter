using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DevsLetter.API.Middlewares;
using DevsLetter.API.Models;
using DevsLetter.API.Services;
using DevsLetter.API.Services.Implementations;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace DevsLetter.API
{
    public class Startup
    {
        public Startup(IHostEnvironment env)
        {
            var builder = new ConfigurationBuilder()
            .SetBasePath(env.ContentRootPath)
            .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
            .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
            .AddEnvironmentVariables();

            Configuration = builder.Build();
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<StartupAuthDatabaseSettings>(
                Configuration.GetSection(nameof(StartupAuthDatabaseSettings)));

            services.AddSingleton<IStartupAuthDatabaseSettings>(sp =>
                sp.GetRequiredService<IOptions<StartupAuthDatabaseSettings>>().Value);

            services.Configure<ApplicationSettings>(
                Configuration.GetSection(nameof(ApplicationSettings)));

            services.AddSingleton<IApplicationSettings>(sp =>
                sp.GetRequiredService<IOptions<ApplicationSettings>>().Value);

            services.AddTransient<IUserService, UserService>();
            services.AddTransient<IDevsLetterService, DevsLetterService>();
            services.AddTransient<JWTMiddleware>();

            services.AddAuthentication(a =>
            {
                a.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                a.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(cfg =>
            {
                cfg.TokenValidationParameters = new TokenValidationParameters
                {
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration.GetValue<string>("ApplicationSettings:Secret"))),
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    LifetimeValidator = (DateTime? notBefore,
                                         DateTime? expires, SecurityToken securityToken,
                                         TokenValidationParameters validationParameters) =>
                    {
                        return notBefore <= DateTime.UtcNow && expires >= DateTime.UtcNow;
                    }
                };
            });

            services.AddControllers();
            services.AddCors();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseCors(
                       options => options.SetIsOriginAllowed(x => _ = true).AllowAnyMethod().AllowAnyHeader().AllowCredentials()
                   );

            app.UseHttpsRedirection();

            app.UseMiddleware<JWTMiddleware>();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
