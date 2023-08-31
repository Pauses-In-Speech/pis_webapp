import { Button } from '@chakra-ui/react'
import { useColorMode } from '@chakra-ui/color-mode'
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

function ToggleColorMode() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <Button onClick={() => toggleColorMode()}>
      {colorMode === "dark" ? <SunIcon/> : <MoonIcon />}
    </Button>
  );
};

export default ToggleColorMode;