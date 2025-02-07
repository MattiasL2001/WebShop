using System;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Globalization;

namespace WebShop_Backend.Infrastructure.Serialization
{
    public class JsonDateConverter : JsonConverter<DateTime>
    {
        private const string DateFormat = "yyyy-MM-dd";

        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.String)
            {
                if (DateTime.TryParseExact(reader.GetString(), DateFormat, CultureInfo.InvariantCulture, DateTimeStyles.None, out var date))
                {
                    return date;
                }
                throw new JsonException($"Invalid date format. Expected format: {DateFormat}");
            }
            throw new JsonException("Expected string token for DateTime parsing.");
        }

        public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToString(DateFormat));
        }
    }
}
