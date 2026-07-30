using CloudinaryDotNet;
using CloudinaryDotNet.Actions;

namespace API.Services;

public class ImageService
{
    private readonly Cloudinary? _cloudinary;
    public ImageService(IOptions<CloudinarySettings> config)
    {
        if (string.IsNullOrEmpty(config.Value.CloudName) ||
            string.IsNullOrEmpty(config.Value.ApiKey) ||
            string.IsNullOrEmpty(config.Value.ApiSecret))
        {
            return;
        }

        var acc = new CloudinaryDotNet.Account
        (
            config.Value.CloudName,
            config.Value.ApiKey,
            config.Value.ApiSecret
        );

        _cloudinary = new Cloudinary(acc);
    }

    public async Task<ImageUploadResult> AddImageAsync(IFormFile file)
    {
        var uploadResult = new ImageUploadResult();

        if (_cloudinary == null || file.Length == 0)
        {
            return uploadResult;
        }

        using var stream = file.OpenReadStream();
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            Folder = "rf-store"
        };

        uploadResult = await _cloudinary.UploadAsync(uploadParams);

        return uploadResult;
    }

    public async Task<DeletionResult> DeleteImageAsync(string publicId)
    {
        var result = new DeletionResult();

        if (_cloudinary == null)
        {
            return result;
        }

        var deleteParams = new DeletionParams(publicId);
        result = await _cloudinary.DestroyAsync(deleteParams);

        return result;
    }
}

