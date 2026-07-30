import { Box, Container, Link, Paper, Typography } from "@mui/material";

const channels = [
  {
    label: "// email",
    value: "hello@refactor.dev",
    href: "mailto:hello@refactor.dev",
  },
  {
    label: "// github",
    value: "github.com/refactor-store",
    href: "https://github.com/refactor-store",
  },
  {
    label: "// twitter / x",
    value: "@refactor_store",
    href: "https://x.com/refactor_store",
  },
  {
    label: "// bluesky",
    value: "@refactor.dev",
    href: "https://bsky.app/profile/refactor.dev",
  },
];

const faq = [
  {
    q: "Where do you ship?",
    a: "Everywhere. International orders typically arrive within 7-14 business days.",
  },
  {
    q: "What is your return policy?",
    a: "Unused items can be returned within 30 days. We'll cover return shipping on defective products.",
  },
  {
    q: "Do you offer bulk or team orders?",
    a: "Yes — reach out to hello@refactor.dev with your order size and we'll get you a quote.",
  },
  {
    q: "Can I change or cancel my order?",
    a: "Orders can be modified within 2 hours of placement. After that, they enter our build pipeline.",
  },
];

export default function ContactPage() {
  return (
    <Container maxWidth="md" sx={{ px: 2 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="caption" sx={{ color: "primary.main", mb: 1, display: "block" }}>
          // contact
        </Typography>
        <Typography variant="h1" sx={{ mb: 2 }}>
          Get in touch
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 3, maxWidth: 520 }}>
          Questions, feedback, or just want to say hi? The best way to reach us is through
          the channels below. We try to respond within a business day.
        </Typography>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Typography variant="caption" sx={{ color: "primary.main", mb: 2, display: "block" }}>
          // channels
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {channels.map((c) => (
            <Box
              key={c.label}
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                fontFamily: '"DM Mono", monospace',
                fontSize: "0.875rem",
              }}
            >
              <Typography
                sx={{
                  color: "text.muted",
                  minWidth: 120,
                  fontFamily: '"DM Mono", monospace',
                  fontSize: "0.875rem",
                }}
              >
                {c.label}
              </Typography>
              <Link
                href={c.href}
                underline="hover"
                sx={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: "0.875rem",
                  cursor: "pointer",
                }}
              >
                {c.value}
              </Link>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="caption" sx={{ color: "primary.main", mb: 2, display: "block" }}>
          // faq
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {faq.map((item) => (
            <Paper key={item.q} variant="outlined" sx={{ p: 3 }}>
              <Typography
                variant="h4"
                sx={{ fontSize: "0.9375rem", mb: 1, fontFamily: '"DM Mono", monospace"', fontWeight: 500 }}
              >
                {item.q}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                {item.a}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>
    </Container>
  );
}
