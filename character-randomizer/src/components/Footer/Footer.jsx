import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

function Footer() {
  return (
    <Paper variant="elevation" elevation={3} sx={{ paddingY: 2, paddingX: 4 }}>
      <Stack
        direction="column"
        spacing={1}
      >
        <Typography variant="body2">
          This page uses material from the <Link href='https://zenless-zone-zero.fandom.com/wiki/Agent/List'>“Agent List”</Link> article on the <Link href="https://zenless-zone-zero.fandom.com/wiki/Zenless_Zone_Zero_Wiki">Zenless Zone Zero Wiki</Link> at <Link href="https://www.fandom.com/">Fandom</Link> and is licensed under the <Link href="https://creativecommons.org/licenses/by-sa/3.0/">Creative Commons Attribution-Share Alike License</Link>.
        </Typography>
        <Divider />
        <Typography variant="body2">
          This page uses material from the <Link href='https://wutheringwaves.fandom.com/wiki/Resonator/List'>“Resonator/List”</Link> article on the <Link href="https://wutheringwaves.fandom.com/wiki/Wuthering_Waves_Wiki">Wuthering Waves Wiki</Link> at <Link href="https://www.fandom.com/">Fandom</Link> and is licensed under the <Link href="https://creativecommons.org/licenses/by-sa/3.0/">Creative Commons Attribution-Share Alike License</Link>.
        </Typography>
      </Stack>
    </Paper>
  )
}

export default Footer