import {
  Button,
  Flex,
  Heading,
  List,
  ListItem,
  Text,
  ButtonGroup,
} from "@chakra-ui/core";
import path from "path";
import React, { useEffect, useState } from "react";
import { useAppState, useEnv } from "../contexts";
import { TemplateDef } from "../editor/variables";
import { buildDefaultAssigns } from "../editor/VariablesEditor";
import { EditingDump } from "../../../../uniroll-types/variables";

export function TemplatesPane() {
  const { onSelectScene, onSetFiles, onSelectFilepath, files } = useAppState();

  const {
    downloadToLocal,
    uploadFromLocal,
    templateHost = "https://raw.githubusercontent.com/mizchi/uniroll/master/templates/gen/",
  } = useEnv();
  const [templateDefs, setTemplateDefs] = useState<
    Array<{ name: string; description?: string; dependencies?: object }>
  >([]);
  useEffect(() => {
    (async () => {
      const res = await fetch(path.join(templateHost, "list.json"));
      const list = await res.json();
      console.log(list);
      setTemplateDefs(list);
    })();
  }, []);
  return (
    <Flex direction="column" p={8}>
      <Heading>Template</Heading>
      <Flex>
        <ButtonGroup>
          {downloadToLocal && (
            <Button
              onClick={() => {
                const dump = {
                  files,
                  id: Date.now().toString(),
                } as EditingDump;
                downloadToLocal(dump);
              }}
            >
              Save to local
            </Button>
          )}
          {uploadFromLocal && (
            <Button
              onClick={async () => {
                const local = await uploadFromLocal();
                debugger;
                onSetFiles(local.files);

                onSelectScene("editor");
              }}
            >
              Load from local
            </Button>
          )}
        </ButtonGroup>
      </Flex>
      <List>
        {templateDefs.map((pkg) => {
          return (
            <ListItem key={pkg.name} pt={3}>
              <Flex display="inline-flex">
                <Button
                  size="sm"
                  onClick={async () => {
                    const url = path.join(templateHost, pkg.name + ".json");
                    const res = await fetch(url);
                    const data = (await res.json()) as TemplateDef;
                    const assigns = buildDefaultAssigns(data.requiredProps);
                    const newFiles = {
                      ...data.files,
                      "/variables.json": JSON.stringify(assigns, null, 2),
                    };
                    onSetFiles(newFiles);
                    if (newFiles["/variables.json"]) {
                      onSelectFilepath(null);
                      onSelectScene("variables");
                    } else {
                      onSelectScene("editor");
                    }
                  }}
                >
                  load
                </Button>
                <Text fontSize="xl">{`${pkg.name}`}</Text>
              </Flex>
            </ListItem>
          );
        })}
      </List>
    </Flex>
  );
}