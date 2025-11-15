using System;

namespace TravelApi.Models
{
    public class DispatcherInvite
    {
        public int Id { get; set; }
        public string Code { get; set; } = Guid.NewGuid().ToString("N");
        public string CreatedByUserId { get; set; } = default!;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime ExpiresAt { get; set; } = DateTime.UtcNow.AddDays(7);
        public bool IsUsed { get; set; } = false;
        public string? UsedByUserId { get; set; }
    }
}
