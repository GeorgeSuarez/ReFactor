using System.Net;

namespace API.Middleware;

public class ExceptionMiddleware(IHostEnvironment env, ILogger<ExceptionMiddleware> logger) : IMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            await HandleException(context, ex);
        }
    }

    private async Task HandleException(HttpContext context, Exception ex)
    {
        logger.LogError(ex, ex.Message);
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        var response = new ProblemDetails
        {
            Status = 500,
            Detail = env.IsDevelopment()
                ? ex.StackTrace?.ToString()
                : null,
            Title = ex.Message
        };

#pragma warning disable CA1869 // Cache and reuse 'JsonSerializerOptions' instances
        var options = new JsonSerializerOptions
        { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
#pragma warning restore CA1869 // Cache and reuse 'JsonSerializerOptions' instances

        var json = JsonSerializer.Serialize(response, options);

        await context.Response.WriteAsync(json);

    }

}

