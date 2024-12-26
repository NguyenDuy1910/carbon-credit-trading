import { createMap, createMapper } from '@automapper/core';
import { classes } from '@automapper/classes';
import { DocumentEntity } from '../entities/document.entity';
import { Document } from '../../../domain/document';

export const mapper = createMapper({
  strategyInitializer: classes(),
});
createMap(mapper, Document, DocumentEntity);
createMap(
  mapper,
  DocumentEntity,
  Document,
  // forMember(
  //   (destination) => destination.file,
  //   mapFrom((source) => FileMapper.toDomain(source.file)),
  // ),
);
