import { Box, Container, Paper, Typography } from "@mui/material";

const principles = [
  {
    title: "Refactored goods",
    desc: "Every product in our store takes something familiar and reimagines it through a developer lens. A snowboard becomes an Angular Speedster Board. A pair of boots gets the React treatment. The thing you know, rebuilt the way we'd build it.",
  },
  {
    title: "Built for the command line",
    desc: "We believe the best tools are text-based, composable, and predictable. Our gear follows the same philosophy — each piece is designed to do one thing well, fit into a larger system, and look good doing it.",
  },
  {
    title: "Open source ethos",
    desc: "No gatekeeping, no black boxes. We share what we learn, we accept contributions (and returns), and we believe the best communities are the ones that ship constantly.",
  },
];

const team = [
  { role: "// Product", name: "George Suarez" },
  { role: "// Engineering", name: "George Suarez" },
  { role: "// Design", name: "George Suarez" },
  { role: "// Operations", name: "George Suarez" },
];

export default function AboutPage() {
  return (
    <Container maxWidth="md" sx={{ px: 2 }}>
      <Box sx={{ mb: 6 }}>
        <Typography
          variant="caption"
          sx={{ color: "primary.main", mb: 1, display: "block" }}
        >
          // about
        </Typography>
        <Typography variant="h1" sx={{ mb: 2 }}>
          What is ReFactor?
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "text.secondary", mb: 3, maxWidth: 640 }}
        >
          ReFactor is a developer essentials store. We take everyday gear —
          boards, boots, gloves, hats — and refactor them with the sensibilities
          of the people who build the web. Every product is a merge of utility
          and the culture of software.
        </Typography>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Typography
          variant="caption"
          sx={{ color: "primary.main", mb: 2, display: "block" }}
        >
          // how we think
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {principles.map((p) => (
            <Paper key={p.title} variant="outlined" sx={{ p: 3 }}>
              <Typography
                variant="h4"
                sx={{
                  fontSize: "1rem",
                  mb: 1,
                  fontFamily: '"DM Mono", monospace',
                }}
              >
                {p.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", lineHeight: 1.7 }}
              >
                {p.desc}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Typography
          variant="caption"
          sx={{ color: "primary.main", mb: 2, display: "block" }}
        >
          // team
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {team.map((m) => (
            <Box
              key={m.role}
              sx={{
                display: "flex",
                gap: 2,
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
                {m.role}
              </Typography>
              <Typography
                sx={{
                  fontFamily: '"DM Mono", monospace',
                  fontSize: "0.875rem",
                }}
              >
                {m.name}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
}
